interface HeaderPromoProps {
  title: string
}

export default function HeaderPromo(props: HeaderPromoProps) {
  return (
    <div className="w-screen text-white bg-black p-4 text-center text-sm">
      {props.title}
    </div>
  )
}
