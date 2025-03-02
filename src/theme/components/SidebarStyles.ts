export const drawerWidth = 240;

export const sidebarStyles = {
    drawer: {
        width: (open: boolean) => open ? drawerWidth : '64px',
        paper: {
            width: (open: boolean) => open ? drawerWidth : '64px'
        }
    },
    drawerControlIcon: {
        container: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px'
        }
    },
    logo: {
        transition: {
            open: {
                width: '100%',
                maxWidth: '100px',
            },
            closed: {
                width: '50%',
                maxWidth: '32px',
            },
            common: {
                minWidth: '32px',
                height: 'auto',
                transition: 'width 0.3s, max-width 0.3s'
            }
        }
    }
};