<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { items, tags, getYear, formatYearMonth, type TagKey } from '../../data/timeline';

  interface Line {
    text: string;
    kind?: 'cmd' | 'ok' | 'err' | 'dim' | 'art';
  }

  let open = $state(false);
  let lines = $state<Line[]>([
    { text: 'Akitoshi Lab. tty1 — ようこそ', kind: 'dim' },
    { text: "Type 'help' to get started.", kind: 'dim' },
  ]);
  let input = $state('');
  let cmdHistory: string[] = [];
  let histIdx = 0;
  let inputEl = $state<HTMLInputElement | null>(null);
  let outputEl = $state<HTMLDivElement | null>(null);
  let isCoarse = $state(false);
  let reduced = false;

  $effect(() => {
    isCoarse = window.matchMedia('(pointer: coarse)').matches;
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  $effect(() => {
    if (open && inputEl) inputEl.focus();
  });

  $effect(() => {
    lines.length;
    if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
  });

  const FIRST_LOG = new Date('2010-04-01T00:00:00+09:00');

  const RACK = [
    '┌─────────────┐',
    '│ ▓▓▓▓▓▓▓  ● │',
    '├─────────────┤',
    '│ ▓▓▓▓▓▓▓  ● │',
    '├─────────────┤',
    '│ ▓▓▓▓▓▓▓  ● │',
    '└─────────────┘',
  ];

  function out(text: string, kind?: Line['kind']) {
    lines.push({ text, kind });
  }

  function uptimeDays(): number {
    return Math.floor((Date.now() - FIRST_LOG.getTime()) / 86_400_000);
  }

  function fmtItem(i: (typeof items)[number]): string {
    return `${formatYearMonth(i.date)}  ${i.title} — ${i.sub}`;
  }

  const commands: Record<string, { desc: string; run: (args: string[]) => void }> = {
    help: {
      desc: 'コマンド一覧',
      run: () => {
        for (const [name, c] of Object.entries(commands)) {
          out(`  ${name.padEnd(12)} ${c.desc}`);
        }
      },
    },
    whoami: {
      desc: '自己紹介',
      run: () => {
        out('佐伯 明俊 (Akitoshi Saeki)', 'ok');
        out('電気通信大学 在学中 / 京都出身・東京在住');
        out('Robotics → Network / NOC / 自宅サーバー / AI');
      },
    },
    neofetch: {
      desc: 'システム情報',
      run: () => {
        const info = [
          'akitoshi@lab',
          '─────────────',
          'OS:       Akitoshi Lab. (Astro 5 + Svelte 5)',
          'WM:       UnoCSS',
          `Uptime:   ${uptimeDays()} days (since first log 2010-04)`,
          `Events:   ${items.length} logged`,
          `Tags:     ${Object.keys(tags).length}`,
          'Host:     self-hosted, obviously',
          'Location: Tokyo, JP',
        ];
        const rows = Math.max(RACK.length, info.length);
        for (let i = 0; i < rows; i++) {
          const left = (RACK[i] ?? '').padEnd(17);
          out(`${left}${info[i] ?? ''}`, 'art');
        }
      },
    },
    timeline: {
      desc: '活動歴 [--tag <tag>] [--year <y>] [-n <N>]',
      run: (args) => {
        let list = [...items].sort((a, b) => b.date.localeCompare(a.date));
        let n = 12;
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '--tag' && args[i + 1]) {
            const t = args[++i] as TagKey;
            if (!(t in tags)) {
              out(`unknown tag: ${t} (see 'tags')`, 'err');
              return;
            }
            list = list.filter((it) => it.tags.includes(t));
          } else if (args[i] === '--year' && args[i + 1]) {
            list = list.filter((it) => getYear(it.date) === args[++i]);
          } else if (args[i] === '-n' && args[i + 1]) {
            n = parseInt(args[++i], 10) || n;
          }
        }
        if (list.length === 0) {
          out('no entries.', 'dim');
          return;
        }
        for (const it of list.slice(0, n)) out(fmtItem(it));
        if (list.length > n) out(`  … and ${list.length - n} more (-n ${list.length} で全部)`, 'dim');
      },
    },
    tags: {
      desc: 'タグ一覧',
      run: () => {
        out(Object.entries(tags).map(([k, v]) => `${k}(${v})`).join('  '));
      },
    },
    awards: {
      desc: '受賞歴',
      run: () => {
        for (const it of items.filter((i) => i.tags.includes('award'))) {
          out(`${getYear(it.date)}  ${it.title} — ${it.sub}`);
        }
      },
    },
    uptime: {
      desc: '稼働時間',
      run: () => {
        out(`up ${uptimeDays()} days (since first logged activity 2010-04-01)`, 'ok');
      },
    },
    traceroute: {
      desc: '経歴の経路 (traceroute career)',
      run: (args) => {
        if (args[0] !== 'career') {
          out('usage: traceroute career', 'dim');
          return;
        }
        out('traceroute to career (akitoshi-lab.com), 30 hops max');
        const hops = [
          ['kinrin-es.kyoto.jp', '2010.04', '1.221 ms'],
          ['konoe-jhs.kyoto.jp', '2016.04', '2.408 ms'],
          ['higashiyama-hs.kyoto.jp', '2019.04', '3.615 ms'],
          ['robotics.scramble.dev', '2020.04', '4.102 ms'],
          ['uec.ac.jp', '2022.04', '5.331 ms'],
          ['mma.club.uec.ac.jp', '2022.04', '5.332 ms'],
          ['noc.janog.gr.jp', '2026.02', '8.014 ms'],
        ];
        hops.forEach(([host, since, ms], i) => {
          out(` ${String(i + 1).padStart(2)}  ${host.padEnd(26)} (${since})  ${ms}`);
        });
        out(`  8  future.akitoshi-lab.com    * * *`, 'dim');
      },
    },
    ping: {
      desc: '生存確認',
      run: (args) => {
        const host = args[0] ?? 'localhost';
        out(`PONG from ${host}: icmp_seq=1 time=0.042 ms`, 'ok');
        out('(自宅サーバーなので速い)', 'dim');
      },
    },
    ls: {
      desc: 'ファイル一覧',
      run: () => {
        out('awards/  environment/  profile/  timeline/  mind.txt');
      },
    },
    cat: {
      desc: 'ファイル表示 (cat mind.txt)',
      run: (args) => {
        if (args[0] === 'mind.txt') {
          out('好きなことをとことん極める', 'ok');
        } else {
          out(`cat: ${args[0] ?? ''}: No such file or directory`, 'err');
        }
      },
    },
    open: {
      desc: 'タブ/ページを開く (profile|timeline|environment|map)',
      run: (args) => {
        const t = args[0];
        if (t === 'map') {
          out('opening /map …', 'ok');
          location.href = '/map';
        } else if (t === 'profile' || t === 'timeline' || t === 'environment') {
          location.hash = t;
          out(`switched to #${t}`, 'ok');
        } else {
          out('usage: open <profile|timeline|environment|map>', 'dim');
        }
      },
    },
    sudo: {
      desc: '',
      run: () => {
        out('akitoshi is not in the sudoers file.', 'err');
        out('This incident will be reported to the NOC.', 'err');
      },
    },
    clear: {
      desc: '画面クリア',
      run: () => {
        lines = [];
      },
    },
    exit: {
      desc: '閉じる',
      run: () => {
        open = false;
      },
    },
  };

  function runCommand(raw: string) {
    const trimmed = raw.trim();
    out(`akitoshi@lab:~$ ${trimmed}`, 'cmd');
    if (!trimmed) return;
    cmdHistory.push(trimmed);
    histIdx = cmdHistory.length;
    const [name, ...args] = trimmed.split(/\s+/);
    const cmd = commands[name] ?? (name === 'tracert' ? commands.traceroute : undefined);
    if (cmd) {
      cmd.run(args);
    } else {
      out(`zsh: command not found: ${name}`, 'err');
      out("try 'help'", 'dim');
    }
  }

  function onInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      runCommand(input);
      input = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx > 0) input = cmdHistory[--histIdx];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) {
        input = cmdHistory[++histIdx];
      } else {
        histIdx = cmdHistory.length;
        input = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const head = input.split(/\s+/)[0];
      if (head && head === input) {
        const match = Object.keys(commands).filter((c) => c.startsWith(head));
        if (match.length === 1) input = match[0] + ' ';
        else if (match.length > 1) out(match.join('  '), 'dim');
      }
    }
  }

  function onWindowKeydown(e: KeyboardEvent) {
    const isToggleKey = e.key === '`' || e.key === '~' || (e.ctrlKey && e.code === 'Backquote');
    if (isToggleKey) {
      const t = e.target as HTMLElement | null;
      const isForeignInput =
        t && t !== inputEl && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (isForeignInput) return;
      e.preventDefault();
      open = !open;
      return;
    }
    if (e.key === 'Escape' && open) {
      open = false;
    }
  }
</script>

<svelte:window onkeydown={onWindowKeydown} />

{#if open}
  <div
    class="term"
    role="dialog"
    aria-label="隠しターミナル"
    transition:fly={{ y: -340, duration: reduced ? 0 : 240, easing: cubicOut }}
  >
    <div class="term-output font-mono" bind:this={outputEl}>
      {#each lines as line, i (i)}
        <div class="term-line {line.kind ?? ''}">{line.text}</div>
      {/each}
    </div>
    <div class="term-input-row font-mono">
      <span class="prompt">akitoshi@lab:~$</span>
      <input
        type="text"
        class="term-input font-mono"
        bind:this={inputEl}
        bind:value={input}
        onkeydown={onInputKeydown}
        spellcheck="false"
        autocomplete="off"
        autocapitalize="off"
        aria-label="コマンド入力"
      />
    </div>
  </div>
{/if}

{#if isCoarse && !open}
  <button class="term-fab font-mono" onclick={() => (open = true)} aria-label="ターミナルを開く">&gt;_</button>
{/if}

<style>
  .term {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 60;
    height: min(56vh, 480px);
    display: flex;
    flex-direction: column;
    background: rgba(13, 17, 23, 0.97);
    border-bottom: 1px solid #30363d;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
  }

  .term-output {
    flex: 1;
    overflow-y: auto;
    overflow-x: auto;
    padding: 16px 16px 8px;
    font-size: 13px;
    line-height: 1.6;
  }

  .term-line {
    color: #c9d1d9;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .term-line.art {
    white-space: pre;
  }
  .term-line.cmd {
    color: #8b949e;
    margin-top: 6px;
  }
  .term-line.ok {
    color: #3fb950;
  }
  .term-line.err {
    color: #f85149;
  }
  .term-line.dim {
    color: #6e7681;
  }

  .term-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px 14px;
    border-top: 1px solid #21262d;
  }

  .prompt {
    color: #3fb950;
    font-size: 13px;
    flex-shrink: 0;
  }

  .term-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #c9d1d9;
    font-size: 13px;
    caret-color: #3fb950;
  }

  .term-fab {
    position: fixed;
    right: 14px;
    bottom: 14px;
    z-index: 50;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: rgba(255, 255, 255, 0.85);
    color: #6b7280;
    font-size: 13px;
    cursor: pointer;
    opacity: 0.6;
  }
</style>
