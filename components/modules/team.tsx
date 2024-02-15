import Image from 'next/image'
import styles from './team.module.css'
import Link from 'next/link'

export default function Members({members} : {members: {
    name: string,
    img: string,
    role: string,
    description?: string,
    social?: { title: string, link: string}
}[]}) {

    return (
        <>
            {members.map((data, index) => (
                <div key={index} className={styles.member}>
                    <Image src={`/team/${data.img}`} width={450} height={450} alt={`picture of ${data.name}`}/>
                    <h5>{data.name}</h5>
                    <h5>{data.role}</h5>
                    {data.social && <span>
                        <Link href={data.social.link}>{data.social.title}</Link>
                    </span>}
                    <p>{data.description}</p>
                </div>
            ))}
        </>
    )
}