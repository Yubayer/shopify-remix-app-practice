
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    
    return null;
};

export default function updateWehbooks() {
    return (
        <div>
            <h1>Update Wehbooks</h1>
        </div>
    );
}

