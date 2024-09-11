import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    return null;
}


export default function PriceRules() {
    return (
        <div>
            <h1>Price Rules</h1>
            
        </div>
    );
}

