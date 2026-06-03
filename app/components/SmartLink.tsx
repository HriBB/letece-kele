import { Link } from 'react-router'

import type { ComponentProps } from 'react'

import { resolveLink } from '~/lib/link'

type Props = Omit<ComponentProps<'a'>, 'href'> & { href?: string }

/** Uses client-side routing for internal paths, plain <a> for tel/mailto/external. */
export function SmartLink({ href, children, ...rest }: Props) {
  const link = resolveLink(href)
  if (link.internal) {
    return (
      <Link to={link.href} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={link.href} target={link.target} rel={link.rel} {...rest}>
      {children}
    </a>
  )
}

export default SmartLink
