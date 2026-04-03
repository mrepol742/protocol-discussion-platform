export default function Input({
    type,
    value,
    placeholder,
    handleChange,
    required = false,
}: {
    type: string
    value: string
    placeholder: string
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
}) {
    return (
        <input
            type={type}
            id={type}
            onChange={handleChange}
            name={type}
            value={value}
            placeholder={placeholder}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
        />
    )
}
