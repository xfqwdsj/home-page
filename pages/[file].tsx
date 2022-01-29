import fs from 'fs';
import { NextPage } from 'next';
import path from 'path';
import React from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

const dir = path.join(process.cwd(), 'pages_mdx');

function getFilePaths() {
  const fileNames = fs.readdirSync(dir);
  return fileNames.map((name) => {
    return {
      params: {
        file: name.replace(/\.mdx$/, ''),
      },
    };
  });
}

interface MDXPageParams {
  params: {
    file: string;
  };
}

interface MDXPageProps {
  source: MDXRemoteSerializeResult;
}

export async function getStaticPaths() {
  const paths = getFilePaths();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: MDXPageParams) {
  const source = await serialize(fs.readFileSync(`${dir}/${params.file}.mdx`, 'utf8'))
  return {
    props: {
      source: source
    }
  }
}

const Page: NextPage<MDXPageProps> = ({ source }) => {
  return <MDXRemote {...source} />
};

export default Page;
