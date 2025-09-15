import GstSearchForm from "@/components/forms/gst-search-form";

export default async function GstSearchPage() {
    return (
        <div className="md:ml-[2rem]">
            <h1 className="text-xl font-bold">Search Taxpayer Details</h1>
            <p>Enter a GSTIN to fetch public details from the API</p>
            <GstSearchForm />
        </div>
    )
}
