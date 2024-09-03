import { createClient, groq } from "next-sanity";

// Sanity client setup
const client = createClient({
    projectId: '373dv2xv', // Replace with your actual project ID
    dataset: 'production', // Replace with your actual dataset name
    apiVersion: '2024-08-28', // Use the correct API version
    useCdn: false, // Set to true if you want to use the CDN for faster responses
});

// Query for Projects
export async function getProjects() {
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

// Query for About Information
export async function getAboutInfo() {
    return client.fetch(
        groq`*[_type == "about"][0] {
            _id,
            title,
            bio,
            "imageOneUrl": imageOne.asset->url,
            "imageOneAlt": imageOne.alt,
            "imageOneName": imageOne.name,
            "imageOneAge": imageOne.age,
            "imageTwoUrl": imageTwo.asset->url,
            "imageTwoAlt": imageTwo.alt,
            "imageTwoName": imageTwo.name,
            "imageTwoAge": imageTwo.age
        }`
    );
}
