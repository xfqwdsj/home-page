import fs from "fs";
import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import path from "path";
import React from "react";
import {serialize} from "next-mdx-remote/serialize";
import {MDXRemote, MDXRemoteSerializeResult} from "next-mdx-remote";
import {HeadProps} from "../components/head";

const dir = path.join(process.cwd(), "pages_mdx");

const components = {};

interface MDXPageProps {
    source: MDXRemoteSerializeResult;
}

interface MDXPageProps {
    head?: HeadProps;
}

const getFilePaths = () => {
    const fileNames = fs.readdirSync(dir);
    return fileNames.map((name) => {
        return {
            params: {
                file: name.replace(/\.mdx$/, ""),
            },
        };
    });
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getFilePaths();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<{} | MDXPageProps & HeadProps> = async ({params}) => {
    if (!params || !("file" in params)) return {props: {}};
    const source = await serialize(
        fs.readFileSync(`${dir}/${params.file}.mdx`, "utf8"),
        {parseFrontmatter: true},
    );
    const props: MDXPageProps & HeadProps = Object.assign({source}, source.frontmatter as unknown as HeadProps);
    return {props};
};

const Page: NextPage<MDXPageProps> = ({source}) => {
    return <MDXRemote {...source} components={components}/>;
};

export default Page;
