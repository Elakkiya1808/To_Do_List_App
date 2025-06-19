const Header = ({ title }) => {

    return (
        <header>
            <h1>  <img 
                src="to-do6.png" 
                alt="App Icon" 
                className="header-icon"
            />{title}</h1>
        </header>
    )
}

Header.defaultProps = {
    title: "To do List"
}

export default Header;
