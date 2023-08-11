const styles = {
    container: {
        width: '100%',
        height: '100%',
    },
    list: {
        overflowX: 'hidden',
        // There properties disable "focus" effect on list
        boxShadow: 'none',
        outline: 'none',
    } as const,
};

export default styles;
