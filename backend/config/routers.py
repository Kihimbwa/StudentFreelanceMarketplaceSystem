class MicroserviceDatabaseRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'accounts':
            return 'accounts_db'
        elif model._meta.app_label == 'jobs':
            return 'jobs_db'
        elif model._meta.app_label == 'applications':
            return 'applications_db'
        elif model._meta.app_label == 'messaging':
            return 'messaging_db'
        elif model._meta.app_label == 'reviews':
            return 'reviews_db'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'accounts':
            return 'accounts_db'
        elif model._meta.app_label == 'jobs':
            return 'jobs_db'
        elif model._meta.app_label == 'applications':
            return 'applications_db'
        elif model._meta.app_label == 'messaging':
            return 'messaging_db'
        elif model._meta.app_label == 'reviews':
            return 'reviews_db'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'accounts':
            return db == 'accounts_db'
        elif app_label == 'jobs':
            return db == 'jobs_db'
        elif app_label == 'applications':
            return db == 'applications_db'
        elif app_label == 'messaging':
            return db == 'messaging_db'
        elif app_label == 'reviews':
            return db == 'reviews_db'
        
        if app_label in ['admin', 'auth', 'contenttypes', 'sessions']:
            return db == 'accounts_db'
        return None