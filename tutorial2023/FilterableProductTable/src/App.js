// 最初にReactをインポートする
import React from 'react';
// 状態を保存する機能をインポート
import { useState } from 'react';

// 商品カテゴリ行コンポーネント
// - カテゴリ名を表示
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

// 商品行コンポーネント
// - 商品名と価格を表示
function ProductRow({ product }) {
  // 在庫切れ商品は赤で商品名を表示
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

// 商品テーブルコンポーネント
// - 商品データをカテゴリごとに表示
function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    // 検索ワードが製品名に含まれていなければ表示から除外する
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    // 在庫ありのチェックがついている場合に、在庫がない商品は表示から除外する
    if (inStockOnly && !product.stocked) {
      return;
    }
    // カテゴリが１つ前のものと異なる場合、カテゴリ表示行を追加する
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    // 商品行を追加する
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    // 一つ前のカテゴリを保存
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

// 検索欄コンポーネント
// - 検索ワードを入力するテキスト入力欄と、在庫ありで絞り込むチェックボックスを表示
function SearchBar({ filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange }) {
  return (
    <form>
      <input type="text" value={filterText} placeholder="Search..."
       onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input type="checkbox" checked={inStockOnly}
         onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

// フィルタ可能な商品テーブルコンポーネント
// - 検索欄と商品テーブルを表示
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

// 商品データ
// - 果物と野菜の価格、在庫有無、名前のデータ
const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

// エントリポイント
// - フィルタ可能な商品テーブルを表示
export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
