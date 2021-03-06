import classNames from 'classnames'
import {Portal} from 'part:@sanity/components/portal'
import React, {useCallback, useEffect, useState} from 'react'
import {usePopper} from 'react-popper'
import {TooltipArrow} from './tooltipArrow'
import {useTooltip} from './hooks'
import {TooltipPlacement} from './types'

import styles from './tooltip.css'

export interface TooltipProps {
  children?: React.ReactElement
  className?: string
  content: React.ReactNode
  disabled?: boolean
  placement?: TooltipPlacement
  portal?: boolean
  tone?: 'navbar'
  allowedAutoPlacements?: TooltipPlacement[]
  fallbackPlacements?: TooltipPlacement[]
}

export function Tooltip(
  props: TooltipProps & Omit<React.HTMLProps<HTMLDivElement>, 'children' | 'content'>
) {
  const {
    allowedAutoPlacements,
    children,
    className,
    content,
    disabled,
    fallbackPlacements,
    placement = 'bottom',
    portal: portalProp,
    tone,
    ...restProps
  } = props
  const ctx = useTooltip()
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const popper = usePopper(referenceElement, popperElement, {
    placement,
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowElement,
          padding: 4,
        },
      },
      {
        name: 'preventOverflow',
        options: {
          altAxis: true,
          boundary: ctx.boundaryElement || undefined,
          padding: 4,
        },
      },
      {
        name: 'offset',
        options: {offset: [0, 3]},
      },
      {
        name: 'flip',
        options: {
          allowedAutoPlacements,
          fallbackPlacements,
        },
      },
    ],
  })
  const {forceUpdate} = popper
  const [isOpen, setIsOpen] = useState(false)
  const handleBlur = useCallback(() => setIsOpen(false), [])
  const handleFocus = useCallback(() => setIsOpen(true), [])
  const handleMouseEnter = useCallback(() => setIsOpen(true), [])
  const handleMouseLeave = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (forceUpdate) forceUpdate()
  }, [forceUpdate, content])

  if (disabled) {
    return children || <></>
  }

  const popperNode = (
    <div
      {...restProps}
      className={classNames(styles.root, className)}
      data-tone={tone}
      ref={setPopperElement}
      style={popper.styles.popper}
      {...popper.attributes.popper}
    >
      <div className={styles.card}>{content}</div>
      <TooltipArrow ref={setArrowElement} style={popper.styles.arrow} tone={tone} />
    </div>
  )

  return (
    <>
      {children &&
        React.cloneElement(children, {
          onBlur: handleBlur,
          onFocus: handleFocus,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          ref: setReferenceElement,
        })}

      {isOpen && (
        <>
          {portalProp && <Portal>{popperNode}</Portal>}
          {!portalProp && popperNode}
        </>
      )}
    </>
  )
}
