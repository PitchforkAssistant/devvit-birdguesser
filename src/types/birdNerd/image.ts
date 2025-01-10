
export type BirdNerdImage = {
    url: string;
    attribution?: string;
    attributionUrl?: string;
    aspectRatio?: number;
};

export function isBirdNerdImage (object: unknown): object is BirdNerdImage {
    if (!object || typeof object !== "object") {
        return false;
    }
    const image = object as BirdNerdImage;
    return typeof image.url === "string"
        && (!image.attribution || typeof image.attribution === "string")
        && (!image.aspectRatio || typeof image.aspectRatio === "number")
        && (!image.attributionUrl || typeof image.attributionUrl === "string");
}
