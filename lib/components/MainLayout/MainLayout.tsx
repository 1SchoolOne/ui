import { Layout, Menu, MenuProps, SiderProps } from 'antd'
import classnames from 'classnames'
import {
	ArrowLeftToLine as CloseSidebarIcon,
	ArrowRightFromLine as OpenSidebarIcon,
} from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'

import { useLocalStorage } from '~/utils/localStorage'

import schoolOneLogoUrl from '~/assets/schoolone-logo-white.svg'

import { SIDEBAR_STORAGE_KEY, loadStorage } from './MainLayout-utils'

import './MainLayout-styles.less'

interface MainLayoutProps {
	className?: string
	sidebarHeader?: ReactNode
	sidebarFooter?: ReactNode
	sidebarProps?: Omit<SiderProps, 'collapsed' | 'onCollapse' | 'trigger'>
	sidebarMenuProps?: MenuProps
	headerClassName?: string
	header: ReactNode
	contentClassName?: string
	children: ReactNode
}

export function MainLayout(props: MainLayoutProps) {
	const {
		className,
		sidebarHeader,
		sidebarFooter,
		sidebarProps = {},
		sidebarMenuProps = {},
		headerClassName,
		header,
		contentClassName,
		children,
	} = props
	const { className: sidebarClassName, defaultCollapsed = false } = sidebarProps
	const { className: sidebarMenuClassName, ...restSidebarMenuProps } = sidebarMenuProps

	const [isCollapsed, setIsCollapsed] = useState(loadStorage(defaultCollapsed))
	const storage = useLocalStorage()

	useEffect(() => {
		storage.set(SIDEBAR_STORAGE_KEY, isCollapsed)
	}, [storage, isCollapsed])

	return (
		<Layout className={classnames('schoolone-main-layout', className)}>
			<Layout.Sider
				width={200}
				collapsible
				{...sidebarProps}
				className={classnames(
					'schoolone-main-layout__sider',
					{ 'schoolone-main-layout__sider--collapsed': isCollapsed },
					sidebarClassName,
				)}
				collapsed={isCollapsed}
				onCollapse={() => setIsCollapsed((prev) => !prev)}
				trigger={isCollapsed ? <OpenSidebarIcon size={16} /> : <CloseSidebarIcon size={16} />}
			>
				<div className="schoolone-main-layout__sider__header">
					{sidebarHeader ? sidebarHeader : <img src={schoolOneLogoUrl} alt="SchoolOne logo" />}
				</div>
				<Menu
					className={classnames('schoolone-main-layout__sider__menu', sidebarMenuClassName)}
					theme="dark"
					mode="inline"
					{...restSidebarMenuProps}
				/>
				{sidebarFooter && (
					<div className="schoolone-main-layout__sider__footer">{sidebarFooter}</div>
				)}
			</Layout.Sider>
			<Layout>
				<Layout.Header className={classnames('schoolone-main-layout__header', headerClassName)}>
					{header}
				</Layout.Header>
				<Layout.Content className={classnames('schoolone-main-layout__content', contentClassName)}>
					{children}
				</Layout.Content>
			</Layout>
		</Layout>
	)
}
