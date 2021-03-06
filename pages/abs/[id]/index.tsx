import search, { DocsEntity } from '@api/search';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      '& > *': {
        margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
      },
    },
    detailsActions: {
      marginBottom: theme.spacing(1),
    },
  })
);

const formProps = {
  action: '/search/query',
  method: 'get',
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  },
};

const DetailsPage: NextPage<DetailsPageProps> = ({ doc }) => {
  const classes = useStyles();

  return (
    <>
      <Head>{doc && <title>{doc.title}</title>}</Head>
      <pre>{JSON.stringify(doc, null, 2)}</pre>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<DetailsPageProps> = async (
  ctx: GetServerSidePropsContext
) => {
  console.log(ctx);
  try {
    const {
      response: { docs },
    } = await search({
      searchParams: {
        q: `identifier:${ctx.query.id}`,
        fl: [
          'identifier',
          '[citations]',
          'abstract',
          'author',
          'author_count',
          '[fields author=10]',
          'bibcode',
          'citation_count',
          'comment',
          'doi',
          'id',
          'keyword',
          'page',
          'property',
          'pub',
          'pub_raw',
          'pubdate',
          'pubnote',
          'read_count',
          'title',
          'volume',
        ].join(','),
        rows: 1,
      },
      ctx,
    });

    return {
      props: {
        doc: docs[0],
      },
    };
  } catch (e) {
    return {
      props: { doc: undefined },
    };
  }
};

interface DetailsPageProps {
  doc?: DocsEntity;
}

export default DetailsPage;
