# Как замерить скорость процессинга

В src/pick-mode/pick-copy-cache.ts добавил встроенный perf-лог snapshot по флагу.
Лог пишет:
total — общее время snapshot
extract — текстовые/DOM-форматы
images — блок рендера/кодирования изображений
storage — запись кэша
imageRenders — сколько раз реально запускался рендер изображений
Как замерить:

Открой нужную страницу.
В консоли страницы выполни:
`localStorage.setItem("ec:perf:snapshot", "1")`
Сделай 10-20 snapshot на одном и том же типе элемента.
В консоли фильтруй по [Element Copier][perf] snapshot.
Выключить замер:
`localStorage.removeItem("ec:perf:snapshot")`