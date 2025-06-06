interface HeaderProps {
  title: string
  subtitle?: string
}

/**
 * Main page header component for displaying application title and subtitle
 */
const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Main title with responsive sizing */}
      <h1 className="text-4xl md:text-6xl font-semibold text-center mb-4">
        {title}
      </h1>
      {subtitle && (
        <h2 className="text-xl md:text-3xl font-semibold text-center text-zinc-500">
          {subtitle}
        </h2>
      )}
    </div>
  )
}

export default Header