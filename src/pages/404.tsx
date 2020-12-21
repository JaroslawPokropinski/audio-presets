import Link from 'next/link'

const GoHome = () => (
  <Link href="/">
    <a>home</a>
  </Link>
);

export default function Custom404() {
  return <p>
  You are drunk or lost, go <GoHome />.
</p>
}