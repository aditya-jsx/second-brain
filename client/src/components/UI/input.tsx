export function Input({ref, placeholder}: {ref?: any, placeholder:string}) {
    return(
        <div>
            <input ref={ref} type="text" placeholder={placeholder} className="px-4 py-2 border rounded-lg"/>
        </div>
    )
}