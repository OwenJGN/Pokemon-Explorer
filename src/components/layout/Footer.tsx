interface FooterProps {
    message?: string
  }
  
  const Footer = ({ message = "Thank you for using Pokémon Browser!" }: FooterProps) => {
    return (
      <div className="py-16 text-center">
        <p className="text-lg">{message}</p>
      </div>
    )
  }
  
  export default Footer