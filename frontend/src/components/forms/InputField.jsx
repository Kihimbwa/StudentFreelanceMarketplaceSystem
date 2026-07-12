function InputField({ 
  label, 
  type = "text", 
  placeholder 
}) {

  return (
    <div className="mb-4">

      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="
          w-full 
          px-4 
          py-3 
          border 
          rounded-lg
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

    </div>
  );
}

export default InputField;