interface ResolverTestCase {
  id: string;
  query: string;
  variables?: {
    [key: string]: string | string[] | number | number[];
  };
}

export default ResolverTestCase;
