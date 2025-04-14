interface ListItem {
  foudid: number;
  foudname: string;
}

interface ModalListComponentProps {
  open: boolean;
  onClose: (newValue: ListItemp[]) => void;
  foudlist:ListItem[];
}

interface DataList {
  id?:number;
  nickname?:string;
  foudlist?:string[];
}