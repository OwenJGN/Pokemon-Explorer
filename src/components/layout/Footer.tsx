interface FooterProps {
  message?: string
}

/**
 * Simple footer component 
 * Displays a customisable message 
 */
const Footer = ({ message = "Thank you for using Pokémon Browser!" }: FooterProps) => {
  return (
    <div className="py-16 text-center">
      {/* Footer Message */}
      <p className="text-lg">{message}</p>
    </div>
  )
}

export default Footer