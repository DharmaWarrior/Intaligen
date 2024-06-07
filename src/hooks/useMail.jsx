import { atom, useAtom } from "jotai";

import { mails } from "./../data/mails";

// Initial configuration for the atom
const configAtom = atom({
  selected: mails[0].id,
});

// Custom hook to use the mail configuration atom
export function useMail() {
  return useAtom(configAtom);
}
