const head: HeadProps = {
    pageTitle: "${PAGE_TITLE}",
    pageDescription: "${PAGE_DESCRIPTION}",
    topBarTitle: "${TOP_BAR_TITLE}",
};

export const getStaticProps: GetStaticProps = () => ({
    props: {
        head,
    },
});

const ${CLASS_NAME}: NextPage = () => {
    return (
        <>
            
        </>
    );
};

export default ${CLASS_NAME};
