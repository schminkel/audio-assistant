import { NavLink } from '@/components/NavLink'

export function NavigationLinksTop() {
  return (
    <>
      <NavLink href="/">Startseite</NavLink>
      <NavLink href="/#ActionHistory">Aktivitätsverlauf</NavLink>
      <NavLink href="/#Dashboard">Dashboard</NavLink>
      <NavLink href="/#FAQ">FAQ</NavLink>
    </>
  )
}
