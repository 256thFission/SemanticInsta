

export default function Paper() {
    return (
        <div className="h-[100vh] w-full absolute -z-10">
            <svg width="100%" height="100%">
                <filter id='roughpaper'>
                    <feTurbulence type="fractalNoise" baseFrequency='0.01' result='noise' numOctaves="5"/>
                    <feDiffuseLighting in='noise' lightingColor='#f1faf6' surfaceScale='2'>
                        <feDistantLight azimuth='45' elevation='60'/>
                    </feDiffuseLighting>
                </filter>
                <rect width="100%" height="100%" fill="#C1EEFF" filter="url(#roughpaper)" />
            </svg>
        </div>
    )
}