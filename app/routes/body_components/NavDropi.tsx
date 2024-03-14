import { Link } from '@remix-run/react';
import { Thumbnail, ButtonGroup, Button, FullscreenBar, Card } from '@shopify/polaris';
import { useState, useCallback } from "react";
import logoDropi from "../../../public/avatar.png";
export const NavDropi = () => {

  /******Nav  */
  const [isFullscreen, setFullscreen] = useState(true);

  const handleActionClick = useCallback(() => {
    console.log("click en black")
    setFullscreen(false);
  }, []);
  /**************** */

  return (
    <div>
      <Card>
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0rem',
          }}
        >

          <img style={avatarMask} src={logoDropi} alt="logo dropi" />

          <ButtonGroup>
            <Link to="/app/products_view" style={{ textDecoration: 'none' }}>
              <Button >Productos importados</Button>
            </Link>
            <Link to="/app/" style={{ textDecoration: 'none' }}>
              <Button >Inicio</Button>
            </Link>
          </ButtonGroup>

        </div>
      </Card>
      <br />
    </div>


    /*
    <nav style={navStyle}>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <Link   style={linkStyle}  hoverStyle={hoverLinkStyle} to="/" >Inicio</Link>
        </li>
        <li style={liStyle}>
          <Link to="/app/orders_view"  style={linkStyle}>Órdenes</Link>
        </li>
      </ul>
    </nav>
    */
  );
};

/*
const navStyle = {
  background: '#333',
  color: '#fff',
  padding: '10px',
};

const ulStyle = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
};

const liStyle = {
  marginRight: '10px', // Espacio entre cada enlace
};

const activeLinkStyle = {
  color: 'blue', // Color cuando el enlace está activo
};

const hoverLinkStyle = {
  color: 'red', // Color cuando el cursor está sobre el enlace
};
*/


const hoverLinkStyle = {
  color: 'red', // Color cuando el cursor está sobre el enlace
};
const avatarMask = {
  width: '100px',
  height: '35px',
  borderRadius: '50px',
  overFlow: 'hidden'
}