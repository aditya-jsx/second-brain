export function Input({onChange, placeholder}: {placeholder:string, onChange?: () => void}) {
    return(
        <div>
            <input type="text" placeholder={placeholder} className="px-4 py-2 border rounded-lg" onChange={onChange} />
        </div>
    )
}