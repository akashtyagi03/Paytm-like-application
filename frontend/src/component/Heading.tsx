interface Headingprops {
    label:String
}

export function Heading({label}:Headingprops){
    return <div className="font-bold text-4xl pt-6">
        {label}
    </div>
}