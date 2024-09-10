"use client";

import PageContainer from "@/components/container/PageContainer";
import DashboardCard from "@/components/shared/DashboardCard";
import { listProductsClient, Product } from "@/service/client";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { formatDate } from "@/utils/mask";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Stack,
  SxProps,
} from "@mui/material";
import { set } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductItemProps {
  item: Product;
  onClick?: (item: Product) => void;
  sx?: SxProps;
}

function getImgSrc(type: string) {
  switch (type) {
    case "waveRunner":
      return { src: "/images/svgs/waveRunner.svg", color: "#8FD14F" };
    case "engine":
      return { src: "/images/svgs/engine.svg", color: "#F24726" };
    case "vessel":
      return { src: "/images/svgs/boat.svg", color: "#FAC710" };
    default:
      return { src: "/images/svgs/boat.svg", color: "#FAC710" };
  }
}

function ProductItem({ item, onClick }: ProductItemProps) {
  const { model, year, type } = item;

  return (
    <Stack
      onClick={() => onClick && onClick(item)}
      direction={"row"}
      alignItems={"center"}
      sx={{
        maxWidth: "350px",
        width: "100%",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginRight: "10px",
        marginBottom: "10px",
        cursor: "pointer",
      }}
    >
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          width: "50px",
          height: "50px",
          borderRadius: "100%",
          backgroundColor: getImgSrc(type).color,
          marginRight: "10px",
        }}
      >
        <Image width={30} height={30} src={getImgSrc(type).src} alt={"icone"} />
      </Stack>
      <Stack>
        <Box fontWeight={600}>{model}</Box>
        <Box>{year}</Box>
      </Stack>
    </Stack>
  );
}

export default function Products() {
  const searchParams = useSearchParams();
  const cpf = searchParams.get("cpf");
  const customizer = useSelector((state: AppState) => state.customizer);

  const [listProducts, setListProducts] = useState<Product[]>();
  const [selected, setSelected] = useState<Product>();

  function getTitle(type?: string) {
    if (!type) return "Meus produtos";

    switch (type) {
      case "waveRunner":
        return "Detalhes do Jet Ski";
      case "engine":
        return "Detalhes do motor";
      case "vessel":
        return "Detalhes da embarcação";
      default:
        return "Meus produtos";
    }
  }

  async function getClientProducts() {
    if (!cpf) return;
    try {
      const res = await listProductsClient(cpf);
      setListProducts(res);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getClientProducts();
  }, []);

  return (
    <PageContainer
      title="Produtos"
      description="Listagem de produtos cadastrados"
    >
      <Container
        sx={{
          maxWidth: customizer.isLayout === "boxed" ? "lg" : "100%!important",
        }}
      >
        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <DashboardCard title={getTitle(selected?.type)}>
                <Stack direction={"row"} width="100%" flexWrap={"wrap"}>
                  {selected ? (
                    <Stack direction={"column"} width="100%" spacing={1}>
                      <Box sx={{ width: "100%", paddingBottom: "20px" }}>
                        <ProductItem item={selected} />
                      </Box>
                      {selected.brand && (
                        <Box>
                          Marca: <b>{selected.brand}</b>
                        </Box>
                      )}
                      {selected.model && (
                        <Box>
                          Modelo: <b>{selected.model}</b>
                        </Box>
                      )}
                      {selected.year && (
                        <Box>
                          Ano: <b>{selected.year}</b>
                        </Box>
                      )}
                      {selected.typeOfFuel && (
                        <Box>
                          Tipo de combustível: <b>{selected.typeOfFuel}</b>
                        </Box>
                      )}
                      {selected.serial && (
                        <Box>
                          Chassi/Serial: <b>{selected.serial}</b>
                        </Box>
                      )}
                      {selected.saleDate && (
                        <Box>
                          Data de venda: <b>{formatDate(selected.saleDate)}</b>
                        </Box>
                      )}
                      {selected.invoice && (
                        <Box>
                          Nota fiscal: <b>{selected.invoice}</b>
                        </Box>
                      )}
                      {selected.leisureOrCommercial && (
                        <Box>
                          Uso lazer ou comercial:{" "}
                          <b>{selected.leisureOrCommercial}</b>
                        </Box>
                      )}
                      {selected.shipyard && (
                        <Box>
                          Estaleiro: <b>{selected.shipyard}</b>
                        </Box>
                      )}
                      {selected.buildingMaterial && (
                        <Box>
                          Material de construção:{" "}
                          <b>{selected.buildingMaterial}</b>
                        </Box>
                      )}
                      {selected.newOrUsed && (
                        <Box>
                          Novo ou usado: <b>{selected.newOrUsed}</b>
                        </Box>
                      )}
                      {selected.length && (
                        <Box>
                          Comprimento: <b>{selected.length}</b>
                        </Box>
                      )}

                      {selected.createdAt && (
                        <Box>
                          Cadastrado em: <b>{formatDate(selected.createdAt)}</b>
                        </Box>
                      )}
                    </Stack>
                  ) : (
                    listProducts?.map((product, index) => (
                      <ProductItem
                        key={index}
                        item={product}
                        onClick={setSelected}
                      />
                    ))
                  )}
                </Stack>
              </DashboardCard>
              {selected && (
                <Button
                  sx={{
                    maxWidth: "300px",
                    width: "100%",
                    height: "60px",
                    marginTop: "20px",
                  }}
                  size="large"
                  onClick={() => setSelected(undefined)}
                  variant="contained"
                  color="inherit"
                >
                  {"Voltar"}
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </PageContainer>
  );
}
