import { Link } from "@remix-run/react";



export default function Nav() {
    return (<>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to={'/app'} className="nav-link active" aria-current="page">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/app/webhooks'} className="nav-link " aria-current="page">Webhooks</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/app/products'} className="nav-link " aria-current="page">Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/app/price-rules'} className="nav-link " aria-current="page">Price Rules</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/app/storefront'} className="nav-link " aria-current="page">Storefront</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/app/additional'} className="nav-link " aria-current="page">Additional</Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>

    </>)
}