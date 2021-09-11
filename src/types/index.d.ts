declare module 'react-search-field' {
  interface SearchFieldProps {
    placeholder: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    searchText: string;
    classNames: string
  }
  // export default class SearchField extends React.Component<SearchFieldProps & any, any> {
  // }
  const SearchFieldProps = (SearchFieldProps): JSX.Element => {};
  export default SearchFieldProps
}
