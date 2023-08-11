const styles = {
    container: {
        width: '100%',
        height: '100vh',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    list: {
        overflowX: 'hidden',
        // There properties disable "focus" effect on list
        boxShadow: 'none',
        outline: 'none',
    } as const,
};

export default styles;
