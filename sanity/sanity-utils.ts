import { createClient, groq } from "next-sanity";

export async function getProjects() {
    const client = createClient({
        projectId: '373dv2xv',
        dataset: 'production',
        apiVersion: '2024-08-28',
        useCdn: false
    });

    return client.fetch(
        groq`*[_type == "project"] {
            _id,
            name,
            bio,
            "thumbnail": thumbnail.asset->url,
            "hoverImage": hoverImage.asset->url,
            url
          }`
        );

}