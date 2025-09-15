import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GstSearchForm from "@/components/forms/gst-search-form";

export default async function GstSearchPage() {
    return (
        <ProtectedRoute>
            <div className="md:ml-[2rem]">
                <GstSearchForm />
            </div>
        </ProtectedRoute>
    )
}
