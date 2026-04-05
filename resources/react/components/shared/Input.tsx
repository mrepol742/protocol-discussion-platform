/**
 * Input component for user authentication forms (login and registration).
 *
 * @param type - The type of input (e.g., 'text', 'email', 'password', 'password_confirmation').
 * @param value - The current value of the input field.
 * @param placeholder - The placeholder text for the input field.
 * @param handleChange - The function to call when the input value changes.
 * @param required - Whether the input field is required (default: false).
 * @returns A styled input element with appropriate attributes based on the type.
 */
export default function Input({
    name,
    type,
    value,
    placeholder,
    handleChange,
    required = false,
}: {
    name: string
    type: string
    value: string
    placeholder: string
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
}) {
    return (
        <input
            type={type}
            id={name}
            onChange={handleChange}
            name={name}
            value={value}
            placeholder={placeholder}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
            autoComplete={
                name === 'password' || name === 'password_confirmation' ? 'new-password' : 'off'
            }
        />
    )
}
