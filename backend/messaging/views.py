from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Message
from .serializers import MessageSerializer

User = get_user_model()

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        partner_id = self.request.query_params.get('partner_id')
        
        # Kama kuna partner_id kwenye URL, rudisha meseji za wawili tu (DM Chat Window)
        if partner_id:
            return Message.objects.filter(
                (Q(sender_id=user_id) & Q(receiver_id=partner_id)) |
                (Q(sender_id=partner_id) & Q(receiver_id=user_id))
            ).order_by('created_at')
            
        # Vinginevyo rudisha meseji zote anazohusika nazo
        return Message.objects.filter(
            Q(sender_id=user_id) | Q(receiver_id=user_id)
        ).order_by('created_at')

    def perform_create(self, serializer):
        # Tunapitisha sender_id kwa usalama wakati wa kusave
        serializer.save(sender_id=self.request.user.id)

    # ACTION MPYA: Inaweka meseji zote ulizotumiwa na huyu partner kuwa "Zimesomwa" (is_read=True)
    @action(detail=False, methods=['post'])
    def mark_read(self, request):
        user_id = request.user.id
        partner_id = request.data.get('partner_id')

        if not partner_id:
            return Response(
                {"error": "partner_id inahitajika kwenye payload"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Tafuta meseji zote alizokutumia huyu partner ambazo bado hujazisoma, kisha ziweke kuwa True
        unread_messages = Message.objects.filter(
            sender_id=partner_id,
            receiver_id=user_id,
            is_read=False
        )
        
        count = unread_messages.count()
        unread_messages.update(is_read=True)

        return Response(
            {"status": "success", "marked_count": count}, 
            status=status.HTTP_200_OK
        )

    # Njia ya kuchukua Orodha ya Chats upande wa kushoto (Inbox)
    @action(detail=False, methods=['get'])
    def conversations(self, request):
        user_id = request.user.id
        
        # Tafuta meseji zote ambazo huyu user anahusika nazo
        all_messages = Message.objects.filter(Q(sender_id=user_id) | Q(receiver_id=user_id))
        
        # Tafuta ID za watu wote aliowahi kuchat nao
        partner_ids = set()
        for msg in all_messages:
            if msg.sender_id != user_id:
                partner_ids.add(msg.sender_id)
            if msg.receiver_id != user_id:
                partner_ids.add(msg.receiver_id)
                
        conversations_list = []
        
        # Kwa kila mtu, tafuta meseji ya mwisho na jina lake
        for p_id in partner_ids:
            last_msg = Message.objects.filter(
                (Q(sender_id=user_id) & Q(receiver_id=p_id)) |
                (Q(sender_id=p_id) & Q(receiver_id=user_id))
            ).order_by('-created_at').first()
            
            # Kama hakuna ujumbe, ruka huyu mshiriki
            if not last_msg:
                continue
            
            # Kuchukua taarifa za mtumiaji husika kutoka kwenye Auth User model ya Django
            try:
                partner_user = User.objects.get(id=p_id)
                partner_name = partner_user.username
                
                # Kulinda kodi isifeli kama model yako haina uwanja wa 'role'
                if hasattr(partner_user, 'role'):
                    partner_role = str(partner_user.role)
                elif hasattr(partner_user, 'is_staff') and partner_user.is_staff:
                    partner_role = "Admin"
                else:
                    partner_role = "User"
            except User.DoesNotExist:
                partner_name = f"Mtumiaji #{p_id}"
                partner_role = "User"

            conversations_list.append({
                'id': str(p_id),
                'name': partner_name,
                'role': partner_role,
                'lastMessage': last_msg.content,
                'time': last_msg.created_at.strftime("%I:%M %p") if last_msg.created_at else "Sasa hivi",
                'unread': Message.objects.filter(sender_id=p_id, receiver_id=user_id, is_read=False).count()
            })
                
        return Response(conversations_list)