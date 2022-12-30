import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { InputWithIcon } from 'components/InputWithIcon';
import * as Prompt from 'components/Prompt';
import { SearchItem } from 'components/Search';
import getParent from 'core/part/getParent';
import getPart from 'core/part/getPart';
import insert from 'core/part/insert';
import usePopupConcurrency from 'hooks/usePopupConcurrency';
import useTranslator from 'hooks/useTranslator';
import { useRef } from 'react';
import useBlueprint from 'stores/blueprint';
import usePartRegistry from 'stores/partRegistry';
import { PromptProps } from 'stores/prompts';

export default function InsertPartPrompt({ dismiss }: PromptProps) {
  const { t } = useTranslator();
  const input = useRef<HTMLInputElement>(null);
  const list: SearchItem[] = [];
  const partRegistry = usePartRegistry();
  const { selections } = useBlueprint.getState();
  const lastSelectionId = selections[selections.length - 1];
  const lastSelection = getPart(lastSelectionId);
  let parentId: string | null = null;
  let index: number | undefined;

  if (lastSelection) {
    if (lastSelection.n === 'Group') {
      parentId = lastSelectionId;
    } else {
      const parent = getParent(lastSelectionId);

      if (parent) {
        parentId = parent.id;
        index = parent.part_order.indexOf(lastSelectionId);
      }
    }
  }

  partRegistry.forEach(({ vanillaData, Icon, data: { label, n } }) => {
    const note = vanillaData === null
      ? t`tabs.layout.popup.insert_part.abstract`
      : undefined;

    const handleClick = () => {
      insert(n, parentId, {
        index,
        nearCamera: true,
        select: true,
      });
      dismiss();
    };

    list.push({
      string:
        vanillaData === null
          ? `${label} ${t`tabs.layout.popup.insert_part.abstract`}`
          : label,
      node: (
        <Prompt.SearchItem
          key={`part-${n}`}
          icon={<Icon />}
          note={note}
          onClick={handleClick}
        >
          {label}
        </Prompt.SearchItem>
      ),
      callback: handleClick,
    });
  });

  usePopupConcurrency();

  return (
    <Prompt.Root padding="thin">
      <InputWithIcon
        ref={input}
        icon={<MagnifyingGlassIcon />}
        placeholder={t`tabs.layout.popup.insert_part.input_placeholder`}
        autoFocus
      />

      <Prompt.Search
        list={list}
        input={input}
        fallback={
          <Prompt.SearchFallback>{t`tabs.layout.popup.insert_part.fallback`}</Prompt.SearchFallback>
        }
        escape={dismiss}
      />

      <Prompt.Actions>
        <Prompt.Action onClick={dismiss}>
          {t`tabs.layout.popup.insert_part.cancel`}
        </Prompt.Action>
      </Prompt.Actions>
    </Prompt.Root>
  );
}