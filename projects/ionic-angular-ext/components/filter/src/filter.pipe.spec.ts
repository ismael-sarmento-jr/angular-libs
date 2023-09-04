import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if items are not defined', () => {
    const items = undefined;
    const property = 'name';
    const filterValue = 'test';
    const filteredItems = pipe.transform(items, property, filterValue);

    expect(filteredItems).toEqual([]);
  });

  it('should return all items if filter value is not defined', () => {
    const items = [{name: 'test1'}, {name: 'test2'}, {name: 'test3'}];
    const property = 'name';
    const filterValue = undefined;
    const filteredItems = pipe.transform(items, property, filterValue);

    expect(filteredItems).toEqual(items);
  });

  it('should filter items by property value', () => {
    const items = [{name: 'test1'}, {name: 'test2'}, {name: 'test3'}];
    const property = 'name';
    const filterValue = 'test2';
    const filteredItems = pipe.transform(items, property, filterValue);

    expect(filteredItems.length).toEqual(1);
    expect(filteredItems[0]).toEqual(items[1]);
  });

  it('should filter items case-insensitively', () => {
    const items = [{name: 'test1'}, {name: 'TeSt2'}, {name: 'test3'}];
    const property = 'name';
    const filterValue = 'test2';
    const filteredItems = pipe.transform(items, property, filterValue);

    expect(filteredItems.length).toEqual(1);
    expect(filteredItems[0]).toEqual(items[1]);
  });
});
