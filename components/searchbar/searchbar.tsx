import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { queryState } from '@recoil/atoms';
import clsx from 'clsx';
import React from 'react';
import { useRecoilState } from 'recoil';

const SearchBar: React.FC<ISearchBarProps> = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [{ q: query = '' }, setQueryState] = useRecoilState(queryState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryState({ q: e.currentTarget.value });
  };

  const clearBtnCls = clsx(
    { hidden: query?.length === 0, block: query?.length > 0 },
    'absolute inset-y-0 right-20 flex items-center'
  );

  const handleClear = () => {
    setQueryState({ q: '' });
    inputRef?.current?.focus();
  };

  return (
    <div>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type="text"
          className="form-input block w-full h-12 pl-2 pr-28 text-sm sm:leading-5 md:text-lg"
          name="q"
          placeholder="Search"
          value={query}
          onChange={handleChange}
          ref={inputRef}
        />
        <div className={clearBtnCls}>
          <button
            type="button"
            className="text-gray-700 text-2xl font-bold px-3 h-10 rounded hover:bg-grey-300"
            onClick={handleClear}
            aria-label="clear search"
            title="clear search"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="absolute inset-y-0 right-1 flex items-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 px-7 border border-blue-700 rounded"
            aria-label="submit search"
            title="submit search"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
    </div>
  );

  // const classes = useStyles();

  // return (
  //   <Autocomplete
  //     id="search-input"
  //     options={['test', 'test2']}
  //     openOnFocus={false}
  //     renderInput={(params) => (
  //       <Paper className={classes.root} innerRef={params.InputProps.ref}>
  //         <InputBase
  //           placeholder="Search"
  //           name="q"
  //           defaultValue={value}
  //           {...params.inputProps}
  //           className={classes.input}
  //         />
  //         <QuickFields />
  //         <IconButton
  //           className={classes.searchButton}
  //           aria-label="search"
  //           type="submit"
  //         >
  //           <SearchIcon />
  //         </IconButton>
  //       </Paper>
  //     )}
  //   />
  // );
};

interface ISearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       padding: 0,
//       display: 'flex',
//       alignItems: 'center',
//       width: '100%',
//     },
//     input: {
//       marginLeft: theme.spacing(1),
//       flex: 1,
//     },
//     iconButton: {
//       padding: 10,
//     },
//     searchButton: {
//       borderRadius: '0 4px 4px 0',
//       color: theme.palette.getContrastText(theme.palette.secondary.main),
//       backgroundColor: theme.palette.secondary.main,
//       '&:hover': {
//         backgroundColor: theme.palette.secondary.dark,
//       },
//     },
//   })
// );

export default SearchBar;
