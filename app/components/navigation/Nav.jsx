import { Link, NavLink } from "@remix-run/react";

export default function Nav() {
    return (<>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">

                        <li className="nav-item">
                            <NavLink to={'/app'} className="nav-link ">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={'/app/webhooks'} className="nav-link ">Webhooks</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={'/app/products'} className="nav-link">Products</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={'/app/subscription'} className="nav-link">Billing</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={'/app/price-rules'} className="nav-link ">Price Rules</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={'/app/storefront'} className="nav-link ">Storefront</NavLink>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>

    </>)
}