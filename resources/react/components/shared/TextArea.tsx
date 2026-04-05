export default function Textarea({
    name,
    value,
    placeholder,
    handleChange,
    required = false,
    rows = 4,
}: {
    name: string
    value: string
    placeholder: string
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    required?: boolean
    rows?: number
}) {
    return (
        <textarea
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            rows={rows}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required={required}
        />
    )
}
