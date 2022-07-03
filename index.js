"use static";

const createListItem = (id, content, delete_, edit, bell, tfBell) => {
  /**
   * ボタンを返す関数
   * @param {string} c クリック時に呼ばれる
   * @param {string} img 画像へのリンク
   * @param {string} alt 画像の説明
   * @returns {HTMLElement}
   */
  const MakeToolButton = (c,img,alt) => {
    const e = document.createElement("button");
    e.onclick = c;
    e.appendChild((() => {
      const i = document.createElement("img")
      i.src = img
      i.alt = alt
      return i
    })())
    return e
  }
  // 作成
  const MainBox = document.createElement("li")
  const ContentBox = document.createElement("pre")
  const ToolBox = document.createElement("div")
  //内容
  ContentBox.textContent = content
  //ボタンの追加
  ToolBox.appendChild(MakeToolButton(delete_,"img/delete.svg","delete"))
  ToolBox.appendChild(MakeToolButton(edit, "img/edit.svg", "edit"))
  //親要素に追加
  MainBox.appendChild(ContentBox)
  MainBox.appendChild(ToolBox)
  //idの指定
  MainBox.id = id
  ContentBox.id = id + "-content"
  return MainBox
}

/**
 * 保存された付箋の一覧
 * @returns {{[T:string]:{content:string}}}
 */
const getListItems = () => {
  //アイテムがあるか?
  if (localStorage.getItem("items") === null) {
    localStorage.setItem("items","{}")//こっちのほうが都合がいいためmapを使う
  }
  //読みっとってJSONにする
  const Items = JSON.parse(localStorage.getItem("items"))
  return Items
}
/**
 * 付箋を保存する
 * @param {{[T:string]:{content:string}}} items 付箋の一覧
 */
const setListItems = (items) => {
  localStorage.setItem("items",JSON.stringify(items))
}

/**
 * 指定されたIDを用いて要素を消す
 * @param {string} id 消すID
 */
const DeleteItem = (id) => {
  const Items = getListItems()
  delete Items[id]
  setListItems(Items)
  document.getElementById(id).remove()
}

/**
 * 指定されたIDを用いて編集する
 * @param {string} id 消すID
 */
const EditItem = (id) => {
  const dialog = document.getElementById("edit")
  const cancel = document.getElementById("edit-cancel")
  const ok = document.getElementById("edit-ok")
  const content = document.getElementById("edit-content")

  cancel.onclick = () => dialog.close()

  ok.onclick = () => {
    dialog.close()
    const Items = getListItems()
    Items[id] = { content: content.value }
    setListItems(Items)

    document.getElementById(id + "-content").textContent = content.value
  }

  dialog.showModal()
}

const CreateItem = () => {
  const dialog = document.getElementById("edit")
  const cancel = document.getElementById("edit-cancel")
  const ok = document.getElementById("edit-ok")
  const content = document.getElementById("edit-content")

  cancel.onclick = () => dialog.close()

  ok.onclick = () => {
    dialog.close()
    const Items = getListItems()
    const Id = Object.keys(Items).length
    Items[Id] = { content: content.value }
    setListItems(Items)

    document.getElementById("list-add").after(createListItem(
      Id,
      content.value,
      DeleteItem.bind(null, Id),
      EditItem.bind(null,Id)
    ))
  }

  dialog.showModal()
}

const CreateAddItemButton = (click) => {
  const MainBox = document.createElement("li")
  const ClickElement = document.createElement("button");
  ClickElement.onclick = click;
  ClickElement.appendChild((() => {
    const i = document.createElement("img")
    i.src = "img/add.svg"
    i.alt = "create sticky note"
    return i
  })())
  MainBox.appendChild(ClickElement)
  MainBox.id = "list-add"
  return MainBox
}

window.addEventListener("load", () => {
  const IdList = document.getElementById("list")

  IdList.appendChild(CreateAddItemButton(CreateItem))

  const Items = getListItems()
  for (const i in Items) {
    IdList.appendChild(
      createListItem(
        i,
        Items[i].content,
        DeleteItem.bind(null, i),
        EditItem.bind(null,i)
      )
    )
  }
})