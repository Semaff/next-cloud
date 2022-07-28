import Image from "next/image";

const Logo = () => {
    return (
        <div className="logo">
            <Image width={35} height={35} src="/favicon.png" alt="logo" />
        </div>
    )
}

export default Logo;