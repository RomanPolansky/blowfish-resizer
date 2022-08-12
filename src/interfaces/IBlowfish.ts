export default interface IBlowfish {
    name: string
    mapElements: any
    resolutions: { width: number, height: number, aspectRatio?: number }[]
    MinAspectRatio: number
    MaxAspectRatio: number
    Update: (width?: number, height?: number) => void
}
