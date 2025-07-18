#!/usr/bin/env node

import ytdl from "@distube/ytdl-core";
import boxen from "boxen";
import chalk from "chalk";
import figlet from "figlet";
import * as fs from "fs";
import { createWriteStream } from "fs";
import inquirer from "inquirer";
import ora from "ora";
import * as path from "path";

interface VideoFormat {
  itag: number;
  quality: string;
  container: string;
  hasVideo: boolean;
  hasAudio: boolean;
  filesize: number | null;
  qualityLabel?: string;
}

interface VideoInfo {
  title: string;
  author: string;
  lengthSeconds: string;
  viewCount: string;
  description: string;
  thumbnails: Array<{ url: string; width: number; height: number }>;
  formats: VideoFormat[];
}

class YouTubeDownloader {
  public async showWelcome(): Promise<void> {
    console.clear();

    const title = figlet.textSync("SC YouTube DL", {
      font: "ANSI Shadow",
      horizontalLayout: "default",
      verticalLayout: "default",
    });

    console.log(chalk.red.bold(title));
    console.log(
      chalk.cyan.bold("📹 Downloader de YouTube bonito e interativo\n")
    );
  }

  public async getVideoInfo(url: string): Promise<VideoInfo> {
    const spinner = ora(
      chalk.blue("🔍 Obtendo informações do vídeo...")
    ).start();

    try {
      const info = await ytdl.getInfo(url);
      const videoDetails = info.videoDetails;

      spinner.succeed(chalk.green("✅ Informações obtidas com sucesso!"));

      return {
        title: videoDetails.title,
        author: videoDetails.author.name,
        lengthSeconds: videoDetails.lengthSeconds,
        viewCount: videoDetails.viewCount,
        description: videoDetails.description || "",
        thumbnails: videoDetails.thumbnails,
        formats: info.formats.map((format: any) => ({
          itag: format.itag,
          quality: format.quality || "unknown",
          container: format.container || "unknown",
          hasVideo: format.hasVideo,
          hasAudio: format.hasAudio,
          filesize: format.contentLength
            ? parseInt(format.contentLength)
            : null,
          qualityLabel: format.qualityLabel,
        })),
      };
    } catch (error) {
      spinner.fail(chalk.red("❌ Erro ao obter informações do vídeo"));
      throw error;
    }
  }

  private formatFileSize(bytes: number | null): string {
    if (!bytes) return chalk.gray("Tamanho desconhecido");

    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, i)).toFixed(2);
    return chalk.yellow(`${size} ${sizes[i]}`);
  }

  private formatDuration(seconds: string): string {
    const totalSeconds = parseInt(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  public displayVideoInfo(info: VideoInfo): void {
    const videoInfoBox = boxen(
      chalk.white.bold(`🎬 ${info.title}\n`) +
        chalk.cyan(`👤 Canal: ${info.author}\n`) +
        chalk.magenta(
          `⏱️  Duração: ${this.formatDuration(info.lengthSeconds)}\n`
        ) +
        chalk.green(
          `👀 Visualizações: ${parseInt(info.viewCount).toLocaleString()}\n`
        ) +
        chalk.gray(
          `📝 Descrição: ${info.description.substring(0, 100)}${
            info.description.length > 100 ? "..." : ""
          }`
        ),
      {
        title: chalk.red.bold("📹 INFORMAÇÕES DO VÍDEO"),
        titleAlignment: "center",
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
      }
    );

    console.log(videoInfoBox);
  }

  private getAvailableFormats(
    formats: VideoFormat[]
  ): Array<{ name: string; value: VideoFormat }> {
    const videoFormats = formats
      .filter((f) => f.hasVideo && f.hasAudio)
      .sort((a, b) => {
        // Ordenar por qualidade
        const qualityOrder: { [key: string]: number } = {
          hd2160: 6,
          "2160p": 6,
          hd1440: 5,
          "1440p": 5,
          hd1080: 4,
          "1080p": 4,
          hd720: 3,
          "720p": 3,
          large: 2,
          "480p": 2,
          medium: 1,
          "360p": 1,
          small: 0,
          "240p": 0,
        };

        const aQuality = qualityOrder[a.qualityLabel || a.quality] || 0;
        const bQuality = qualityOrder[b.qualityLabel || b.quality] || 0;

        return bQuality - aQuality;
      });

    const audioFormats = formats
      .filter((f) => f.hasAudio && !f.hasVideo)
      .slice(0, 3); // Pegar apenas os primeiros 3 formatos de áudio

    const choices: Array<{ name: string; value: VideoFormat }> = [];

    // Adicionar formatos de vídeo
    videoFormats.forEach((format) => {
      const quality = format.qualityLabel || format.quality;
      const size = this.formatFileSize(format.filesize);
      const icon = quality.includes("1080")
        ? "🎬"
        : quality.includes("720")
        ? "📺"
        : quality.includes("480")
        ? "�"
        : "💾";

      choices.push({
        name: `${icon} ${chalk.bold(quality)} (${format.container}) - ${size}`,
        value: format,
      });
    });

    // Adicionar separador
    if (audioFormats.length > 0) {
      choices.push({
        name: chalk.gray("─".repeat(50)),
        value: {} as VideoFormat,
      });

      // Adicionar formatos de áudio
      audioFormats.forEach((format) => {
        const size = this.formatFileSize(format.filesize);
        choices.push({
          name: `🎵 ${chalk.cyan("Apenas Áudio")} (${
            format.container
          }) - ${size}`,
          value: format,
        });
      });
    }

    return choices.filter((choice) => choice.value.itag); // Remover separadores
  }

  public async selectFormat(formats: VideoFormat[]): Promise<VideoFormat> {
    const choices = this.getAvailableFormats(formats);

    if (choices.length === 0) {
      throw new Error("Nenhum formato disponível para download");
    }

    const { selectedFormat } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedFormat",
        message: chalk.yellow("🎯 Escolha a qualidade/formato para download:"),
        choices: choices.map((choice) => ({
          name: choice.name,
          value: choice.value,
        })),
        pageSize: 10,
      },
    ]);

    return selectedFormat;
  }

  public async selectDownloadLocation(): Promise<string> {
    const { useCurrentDir } = await inquirer.prompt([
      {
        type: "confirm",
        name: "useCurrentDir",
        message: chalk.yellow("📁 Baixar na pasta atual?"),
        default: true,
      },
    ]);

    if (useCurrentDir) {
      return process.cwd();
    }

    const { customPath } = await inquirer.prompt([
      {
        type: "input",
        name: "customPath",
        message: chalk.yellow("📍 Digite o caminho para download:"),
        default: process.cwd(),
        validate: (input: string) => {
          try {
            if (!fs.existsSync(input)) {
              return "Pasta não existe. Digite um caminho válido.";
            }
            return true;
          } catch {
            return "Caminho inválido.";
          }
        },
      },
    ]);

    return customPath;
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*]/g, "") // Remove caracteres inválidos
      .replace(/\s+/g, " ") // Normaliza espaços
      .trim()
      .substring(0, 200); // Limita o tamanho
  }

  public async downloadVideo(
    url: string,
    format: VideoFormat,
    info: VideoInfo,
    downloadPath: string
  ): Promise<void> {
    const filename = this.sanitizeFilename(`${info.title}.${format.container}`);
    const filepath = path.join(downloadPath, filename);

    console.log(
      boxen(
        chalk.white(`📥 ${chalk.bold("Iniciando download...")}\n`) +
          chalk.cyan(`📁 Pasta: ${downloadPath}\n`) +
          chalk.green(`📄 Arquivo: ${filename}\n`) +
          chalk.yellow(
            `🎯 Qualidade: ${format.qualityLabel || format.quality}`
          ),
        {
          title: chalk.blue.bold("⬇️ DOWNLOAD"),
          titleAlignment: "center",
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "green",
        }
      )
    );

    return new Promise((resolve, reject) => {
      const video = ytdl(url, { quality: format.itag });
      const writeStream = createWriteStream(filepath);

      let downloadedBytes = 0;
      const totalBytes = format.filesize || 0;

      const spinner = ora({
        text: chalk.blue("⬇️ Baixando..."),
        spinner: "dots12",
      }).start();

      video.on("progress", (chunkLength: any, downloaded: any, total: any) => {
        downloadedBytes = downloaded;
        const percent = ((downloaded / total) * 100).toFixed(1);
        const downloadedMB = (downloaded / 1024 / 1024).toFixed(1);
        const totalMB = (total / 1024 / 1024).toFixed(1);

        spinner.text = chalk.blue(
          `⬇️ Baixando... ${percent}% (${downloadedMB}MB / ${totalMB}MB)`
        );
      });

      video.on("error", (error: any) => {
        spinner.fail(chalk.red("❌ Erro durante o download"));
        reject(error);
      });

      writeStream.on("error", (error) => {
        spinner.fail(chalk.red("❌ Erro ao salvar arquivo"));
        reject(error);
      });

      writeStream.on("finish", () => {
        spinner.succeed(chalk.green(`✅ Download concluído: ${filename}`));

        const successBox = boxen(
          chalk.green.bold(`🎉 SUCESSO!\n`) +
            chalk.white(`📄 Arquivo: ${filename}\n`) +
            chalk.cyan(`📁 Local: ${downloadPath}\n`) +
            chalk.yellow(`📊 Tamanho: ${this.formatFileSize(downloadedBytes)}`),
          {
            title: chalk.green.bold("✅ DOWNLOAD COMPLETO"),
            titleAlignment: "center",
            padding: 1,
            margin: 1,
            borderStyle: "double",
            borderColor: "green",
          }
        );

        console.log(successBox);
        resolve();
      });

      video.pipe(writeStream);
    });
  }

  private async askForAnotherDownload(): Promise<boolean> {
    const { another } = await inquirer.prompt([
      {
        type: "confirm",
        name: "another",
        message: chalk.yellow("🔄 Deseja baixar outro vídeo?"),
        default: false,
      },
    ]);

    return another;
  }

  public async run(): Promise<void> {
    try {
      await this.showWelcome();

      do {
        try {
          // Obter URL do vídeo
          const { videoUrl } = await inquirer.prompt([
            {
              type: "input",
              name: "videoUrl",
              message: chalk.yellow("🔗 Cole a URL do vídeo do YouTube:"),
              validate: (input: string) => {
                if (!input.trim()) {
                  return "Por favor, digite uma URL.";
                }

                if (!ytdl.validateURL(input)) {
                  return "URL inválida. Digite uma URL válida do YouTube.";
                }

                return true;
              },
            },
          ]);

          // Obter informações do vídeo
          const videoInfo = await this.getVideoInfo(videoUrl);

          // Mostrar informações do vídeo
          this.displayVideoInfo(videoInfo);

          // Selecionar formato
          const selectedFormat = await this.selectFormat(videoInfo.formats);

          // Selecionar local de download
          const downloadPath = await this.selectDownloadLocation();

          // Confirmar download
          const { confirmDownload } = await inquirer.prompt([
            {
              type: "confirm",
              name: "confirmDownload",
              message: chalk.yellow("🚀 Iniciar download?"),
              default: true,
            },
          ]);

          if (confirmDownload) {
            await this.downloadVideo(
              videoUrl,
              selectedFormat,
              videoInfo,
              downloadPath
            );
          } else {
            console.log(chalk.gray("⏸️ Download cancelado."));
          }
        } catch (error) {
          console.error(
            boxen(
              chalk.red.bold(`❌ ERRO\n`) +
                chalk.white(
                  `${
                    error instanceof Error ? error.message : "Erro desconhecido"
                  }`
                ),
              {
                title: chalk.red.bold("💥 OOPS!"),
                titleAlignment: "center",
                padding: 1,
                margin: 1,
                borderStyle: "round",
                borderColor: "red",
              }
            )
          );
        }
      } while (await this.askForAnotherDownload());

      console.log(
        chalk.cyan.bold("\n👋 Obrigado por usar o SC YouTube Downloader!\n")
      );
    } catch (error) {
      console.error(chalk.red("❌ Erro fatal:"), error);
      process.exit(1);
    }
  }
}

// Verificar se o script está sendo executado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Modo interativo
    const downloader = new YouTubeDownloader();
    downloader.run();
  } else {
    // Modo com URL como argumento
    const url = args[0];

    if (!ytdl.validateURL(url)) {
      console.error(chalk.red("❌ URL inválida do YouTube"));
      process.exit(1);
    }

    const downloader = new YouTubeDownloader();

    // Executar com URL pré-definida
    (async () => {
      try {
        await downloader.showWelcome();

        const videoInfo = await downloader.getVideoInfo(url);
        downloader.displayVideoInfo(videoInfo);

        const selectedFormat = await downloader.selectFormat(videoInfo.formats);
        const downloadPath = await downloader.selectDownloadLocation();

        const { confirmDownload } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirmDownload",
            message: chalk.yellow("🚀 Iniciar download?"),
            default: true,
          },
        ]);

        if (confirmDownload) {
          await downloader.downloadVideo(
            url,
            selectedFormat,
            videoInfo,
            downloadPath
          );
        } else {
          console.log(chalk.gray("⏸️ Download cancelado."));
        }

        console.log(
          chalk.cyan.bold("\n👋 Obrigado por usar o SC YouTube Downloader!\n")
        );
      } catch (error) {
        console.error(chalk.red("❌ Erro:"), error);
        process.exit(1);
      }
    })();
  }
}
