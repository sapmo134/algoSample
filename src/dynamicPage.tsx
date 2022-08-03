import { ReactElement, useEffect } from 'react';
import { Control, useController, useFieldArray, useForm, useWatch } from 'react-hook-form';
import './dynamicPage.scss';

function MyInput({control, name}: {control: Control, name: string}) {
  const { field } = useController({name, control, defaultValue: ''});
  return (<input {...field}></input>);
}

export function DynamicPage(props: any) {
  const { control, setValue } = useForm({mode: 'onChange'});
  const fieldArray = useFieldArray({control, name: 'data'});

  useEffect(()=> {
    setValue('data', [
      {a: 'abc', b: 'efg'},
      {a: 'xyz', b: '123'},
    ]);
  }, []);
  const gridWatchData = useWatch({control, name: 'data'});

  return (<>
    {/* 各行のHTMLを直接書き下した場合 */}
    <div className="mygrid-plane">{
      fieldArray.fields.map((field, index) => (
        <div className="row" data-rownum="index" key={index}>
          <div className="cell" data-column="a">
            <MyInput control={control} name={`data[${index}].a`}></MyInput>
          </div>
          <div className="cell" data-column="b">
            <span>{(field as any).b}</span>
          </div>
        </div>
      ))}
    </div>
    <br/>
    {/* グリッド部品にした場合 */}
    <MyGrid
      fields={fieldArray.fields}
      templateMap={{
        // ここに各セルのテンプレートを記載する
        // ReactHookForm 対応部品
        a: (field:Record<'id', string>, index: number) => <MyInput control={control} name={`data[${index}].a`}></MyInput>,
        // ReactHookForm 非対応部品
        b: (field:Record<'id', string>, index: number) => <span>{(field as any).b}</span>,
      }}
    />
    {JSON.stringify(gridWatchData)}
  </>);
}

/////////////////
// ここから共通部品

interface IMyGridProps {
  templateMap: {[id: string]: (field: Record<'id', string>, index: number) => ReactElement},
  fields: Record<'id', string>[],
}
function MyGrid(props: IMyGridProps) {
  const { fields, templateMap } = props;
  return (
    <div className="mygrid">
      {fields.map((field: any, index: number) => (
        <Row key={index} templateMap={templateMap} field={field} index={index}/>
      ))}
    </div>
  );
}

interface IRowProps {
  templateMap: {[id: string]: (field: Record<'id', string>, index: number) => ReactElement},
  field: Record<'id', string>,
  index: number;
}
function Row(props: IRowProps) {
  const {templateMap, field, index} = props;
  const contents = Object.keys(templateMap).map((k) => {
    return templateMap[k](field, index);
  });
  return (
    <div className="row">{
      contents.map((content, index) => (<div  key={index} className="cell">{content}</div>))
    }
    </div>
  );
}
