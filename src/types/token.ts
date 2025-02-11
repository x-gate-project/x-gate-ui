import { Scalars, Maybe } from '~/graphql/eip721-subgraph/types';

export type Token = {
  /** id */
  id: Scalars['String'];
  /** Token id */
  tokenId: Scalars['String'];
  /** Token Uri */
  tokenUri: Scalars['String'];
  /** Metadata */
  metadata: {
    animation_url?: Maybe<Scalars['String']>;
    description?: Maybe<Scalars['String']>;
    image: Scalars['String'];
    name: Scalars['String'];
  };
  /** Collection */
  collection: {
    contractAddress: Scalars['String'];
    name?: Maybe<Scalars['String']>;
    symbol?: Maybe<Scalars['String']>;
  };
  /** Owner address */
  ownerAddress: Scalars['String'];
};
